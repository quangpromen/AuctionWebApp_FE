import { ChangeEvent, useContext, useEffect, useState } from "react";
import { Auction } from "../../models/Auction";
import { User } from "../../models/User";
import { Jewelry } from "../../models/Jewelry";
import { changeStateAuction, getAuction } from "../../api/AuctionAPI";
import { useParams } from "react-router-dom";
import { formatNumber } from "../../utils/formatNumber";
import { formatDateString } from "../../utils/formatDateString";
import ImageProduct from "../AuctionDetail/AuctionImageProduct";
import { AuctionTabDetail } from "../AuctionDetail/Components/AuctionTabDetail";
import { BidConfirm } from "../MyAccount/Modal/Modal";
import { BidInfo } from "./Components/BidInfo";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserContext } from "../../hooks/useContext";
import { AuctionHistory } from "../../models/AuctionHistory";
import { getAuctionHistoriesByAuctionId } from "../../api/AuctionHistoryAPI";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

export const AuctionBid = () => {
    const [auction, setAuction] = useState<Auction | null>(null);
    const [jewelry, setJewelry] = useState<Jewelry | null>(null);
    const [staff, setStaff] = useState<User | null>(null);
    const [bidValue, setBidValue] = useState<number>(auction?.lastPrice || 0);
    const [displayValue, setDisplayValue] = useState<string>("");
    const [errorBidValue, setErrorBidValue] = useState("");
    const [timeLeft, setTimeLeft] = useState<{ days: number, hours: number, minutes: number, seconds: number } | string>('');
    const [auctionHistories, setAuctionHistories] = useState<AuctionHistory[]>([]);
    const [bidPerPage, setBidPerPage] = useState<number>(3);
    //----------------------------------------------------------------
    const [connected, setConnected] = useState(false);
    const [stompClient, setStompClient] = useState<Stomp.Client | null>(null);
    const socket = new SockJS('http://localhost:8080/ws');
    //----------------------------------------------------------------

    const context = useContext(UserContext);
    let user: User | null = null;
    if (context?.user) {
        user = context.user;
    }
    const { id } = useParams();
    let auctionId = 0;

    try {
        auctionId = parseInt(id + "");
        if (Number.isNaN(auctionId)) {
            auctionId = 0;
        }
    } catch (error) {
        auctionId = 0;
        console.log("Error parsing auction id: " + error);
    }

    useEffect(() => {
        const newClient = Stomp.over(socket);
        newClient.connect(
          {},
          (frame) => {
            console.log("Connected: " + frame);
            setConnected(true);
            newClient.subscribe("/topic/auction", () => {
            });
          },
          (error) => {
            console.error("Connection error: ", error);
          }
        );
    
        setStompClient(newClient);
        return () => {
          if (connected) {
            newClient.disconnect(() => {
              setConnected(false);
              console.log("Disconnected");
            });
          }
        };
      }, []);

    useEffect(() => {
        if (auctionId !== null) {
            getAuctionHistoriesByAuctionId(auctionId, bidPerPage)
                .then((response) => {
                    setAuctionHistories(response.auctionHistoriesData);
                })
                .catch((error) => {
                    console.error(error.message);
                });
        }
    }, [auctionId, bidPerPage])

    useEffect(() => {
        getAuction(auctionId)
            .then((auction) => {
                setAuction(auction);
                setJewelry(auction?.jewelry ?? null);
                setStaff(auction?.user ?? null);
                setDisplayValue(formatNumber(auction?.lastPrice ?? auction?.firstPrice ?? 0));
                setBidValue(auction?.lastPrice ?? auction?.firstPrice ?? 0);
            })
            .catch((error) => {
                console.log(error.message);
            });
        window.scrollTo(0, 0);
    }, [auctionId]);

    useEffect(() => {
        if (auction && auction.startDate && auction.endDate) {
            const now = new Date().getTime();
            const endDate = new Date(formatDateString(auction.endDate)).getTime();

            if (auction.state === 'ONGOING') {
                // Calculate countdown until end date
                const distanceToEnd = endDate - now;

                if (distanceToEnd < 0) {
                    setTimeLeft("Phiên đấu giá đã kết thúc");
                    changeStateAuction(auction.id, 'FINISHED');
                    return;
                }

                const daysToEnd = Math.floor(distanceToEnd / (1000 * 60 * 60 * 24));
                const hoursToEnd = Math.floor((distanceToEnd % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutesToEnd = Math.floor((distanceToEnd % (1000 * 60 * 60)) / (1000 * 60));
                const secondsToEnd = Math.floor((distanceToEnd % (1000 * 60)) / 1000);

                setTimeLeft({ days: daysToEnd, hours: hoursToEnd, minutes: minutesToEnd, seconds: secondsToEnd });
            } else if (auction.state === 'FINISHED') {
                // Auction finished
                setTimeLeft("Phiên đấu giá đã kết thúc");
                return;
            }

            const timer = setInterval(() => {
                const now = new Date().getTime();

                if (auction.state === 'ONGOING') {
                    const distanceToEnd = endDate - now;

                    if (distanceToEnd < 0) {
                        setTimeLeft("Phiên đấu giá đã kết thúc");
                        clearInterval(timer);
                        return;
                    }

                    const daysToEnd = Math.floor(distanceToEnd / (1000 * 60 * 60 * 24));
                    const hoursToEnd = Math.floor((distanceToEnd % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutesToEnd = Math.floor((distanceToEnd % (1000 * 60 * 60)) / (1000 * 60));
                    const secondsToEnd = Math.floor((distanceToEnd % (1000 * 60)) / 1000);

                    setTimeLeft({ days: daysToEnd, hours: hoursToEnd, minutes: minutesToEnd, seconds: secondsToEnd });
                }
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [auction]);


    useEffect(() => {
        setDisplayValue(formatNumber(bidValue));
    }, [bidValue]);

    const handleIncrement = () => {
        if (auction?.priceStep !== undefined) {
            setBidValue(prevValue => {
                const newValue = (prevValue || 0) + (auction.priceStep ?? 0);
                if (auction.lastPrice === null && newValue <= (auction.firstPrice ?? 0)) {
                    setErrorBidValue("Giá trị đấu giá phải lớn hơn giá cao nhất hiện tại + bước giá");
                    return newValue;
                }
                if (auction.lastPrice !== null && newValue <= (auction.lastPrice ?? 0)) {
                    setErrorBidValue("Giá trị đấu giá phải lớn hơn giá cao nhất hiện tại + bước giá");
                    return newValue;
                }
                setErrorBidValue("")
                return newValue;
            });
        }
    };

    const handleDecrement = () => {
        if (auction?.lastPrice !== undefined) {
            setBidValue(prevValue => {
                const newValue = prevValue - (auction.priceStep ?? 0);
                if (auction.lastPrice === null && newValue < (auction.firstPrice ?? 0)) {
                    setErrorBidValue("Giá trị đấu giá phải lớn hơn giá cao nhất hiện tại + bước giá");
                    return prevValue;
                }
                if (newValue >= auction.lastPrice) {
                    return newValue;
                } else {
                    setErrorBidValue("Giá trị đấu giá phải lớn hơn giá cao nhất hiện tại + bước giá");
                    return prevValue;
                }
            });
        }
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.replace(/[^0-9]/g, '');
        const numericValue = parseInt(value, 10);
        if (auction && !isNaN(numericValue) && numericValue >= 1) {
            setBidValue(numericValue);
            setDisplayValue(formatNumber(numericValue));
            setErrorBidValue("")
            if (auction.lastPrice === null && numericValue < (auction.firstPrice ?? 0) + (auction.priceStep ?? 0)) {
                setErrorBidValue("Giá trị đấu giá phải lớn hơn giá cao nhất hiện tại + bước giá");
                return;
            }
            if (numericValue < ((auction.lastPrice ?? 0) + (auction.priceStep ?? 0))) {
                setErrorBidValue("Giá trị đấu giá phải lớn hơn giá cao nhất hiện tại + bước giá");
                return
            }
        } else {
            setBidValue(auction?.firstPrice || 0);
            setDisplayValue(formatNumber(auction?.firstPrice || 0));
            setErrorBidValue("")
        }
    };

    const renderBidButton = () => {
        if (auction?.lastPrice === null && bidValue < (auction.firstPrice + auction.priceStep)) {
            return (
                <button
                    className="fw-bold text-center eg-btn btn--primary text-white btn--sm"
                    style={{
                        backgroundColor: "#ccc",
                        textTransform: "unset",
                        border: "unset",
                        borderRadius: "5px",
                        padding: "10px 10px",
                        fontSize: "16px"
                    }}
                    disabled
                >
                    <i className="fa fa-gavel" style={{ marginRight: "7px" }}></i>Trả giá
                </button>
            );
        } else if (bidValue >= ((auction?.lastPrice || 0) + (auction?.priceStep || 0))) {
            return <BidConfirm setAuctionHistories={setAuctionHistories} setDisplayValue={setDisplayValue} setAuction={setAuction} username={user?.username} auction={auction} bidValue={bidValue} />;
        } else {
            return (
                <button
                    className="fw-bold text-center eg-btn btn--primary text-white btn--sm"
                    style={{
                        backgroundColor: "#ccc",
                        textTransform: "unset",
                        border: "unset",
                        borderRadius: "5px",
                        padding: "10px 10px",
                        fontSize: "16px"
                    }}
                    disabled
                >
                    <i className="fa fa-gavel" style={{ marginRight: "7px" }}></i>Trả giá
                </button>
            );
        }
    };

    const renderHigherBidButton = () => {
        if ((auction?.lastPrice === null && bidValue < ((auction.firstPrice ?? 0) + (auction.priceStep ?? 0))) ||
            (auction?.lastPrice !== null && bidValue < ((auction?.lastPrice ?? 0) + (auction?.priceStep ?? 0)))) {
            return (
                <button
                    onClick={() => {
                        setBidValue((auction?.lastPrice ?? auction?.firstPrice ?? 0) + (auction?.priceStep ?? 0));
                        setErrorBidValue("");
                    }}
                    className="fw-bold text-center eg-btn btn--primary text-dark btn--sm"
                    style={{
                        backgroundColor: "white",
                        textTransform: "unset",
                        border: "1px solid rgba(0,0,0,.09)",
                        padding: "10px 10px",
                        fontSize: "14px",
                        width: "100%",
                    }}
                >
                    Đặt giá cao hơn mức giá cao nhất 01 (một) bước giá
                </button>
            );
        }
        return null;
    };

    return (
        <>
            <div className="template-color-1">
                <div className="main-wrapper">
                    {/* <!-- Begin Umino's Breadcrumb Area --> */}
                    <div className="breadcrumb-area">
                        <div className="container">
                            <div className="breadcrumb-content">
                                <ul>
                                    <li>
                                        <a href="index.html">Home</a>
                                    </li>
                                    <li className="active">
                                        Đăng kí đấu giá
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    {/* <!-- Umino's Breadcrumb Area End Here -->

                    <!-- Begin Umino's Single Product Sale Area --> */}
                    <div className="sp-area">
                        <div className="container">
                            <div className="sp-nav">
                                <div className="row">
                                    <div className="col-lg-6">
                                        <div className="sp-img_area">
                                            {jewelry && <ImageProduct jewelry={jewelry} />}
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <p className="para" id="countdown-txt">Thời gian còn lại để trả giá</p>
                                        <div className="umino-countdown_area mb-4">
                                            {typeof timeLeft === 'string' ? (
                                                <div className="umino-countdown" style={{ padding: "10px 0px" }}>{timeLeft}</div>
                                            ) : (
                                                <div className="umino-countdown">
                                                    <div className="countdown-item">
                                                        <div>{timeLeft.days}</div>
                                                        <div className="countdown-label">Ngày</div>
                                                    </div>
                                                    <div className="countdown-item">
                                                        <div>{timeLeft.hours}</div>
                                                        <div className="countdown-label">Giờ</div>
                                                    </div>
                                                    <div className="countdown-item">
                                                        <div>{timeLeft.minutes}</div>
                                                        <div className="countdown-label">Phút</div>
                                                    </div>
                                                    <div className="countdown-item">
                                                        <div>{timeLeft.seconds}</div>
                                                        <div className="countdown-label">Giây</div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="register-form" style={{ borderRadius: "0px" }}>
                                            <div className="row">
                                                <h4 className="no-margin fw-bold">ĐẶT GIÁ (VNĐ)</h4>
                                                <BidInfo auction={auction} />
                                                <div className="col-9 d-flex align-items-center">
                                                    <button
                                                        style={{ borderRadius: '0px', border: "1px solid rgba(0,0,0,.09)" }}
                                                        type="button"
                                                        className="btn btn-"
                                                        onClick={handleDecrement}
                                                    >
                                                        -
                                                    </button>
                                                    <input
                                                        type="text"
                                                        className="no-spinners form-control fw-bold text-center"
                                                        style={{ borderRadius: '0px' }}
                                                        value={displayValue}
                                                        onChange={handleInputChange}
                                                    />
                                                    <button
                                                        type="button"
                                                        style={{ borderRadius: '0px', border: "1px solid rgba(0,0,0,.09)" }}
                                                        className="btn btn-outline-secondary"
                                                        onClick={handleIncrement}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <div className="col-3">
                                                    {renderBidButton()}
                                                </div>
                                                <div className="col-9">
                                                    {renderHigherBidButton()}
                                                </div>
                                                {errorBidValue && <span className="fw-bold text-danger mt-2">{errorBidValue}</span>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <AuctionTabDetail setBidPerPage={setBidPerPage} auctionHistories={auctionHistories} auction={auction} staff={staff} jewelry={jewelry} />
                </div>
            </div >

            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light" />
        </>
    )
}