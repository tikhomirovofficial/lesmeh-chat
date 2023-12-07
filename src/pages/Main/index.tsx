import React, { FC, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import io from 'socket.io-client';
import SimplePeer from 'simple-peer';
import styles from './main.module.scss'
import { log } from 'console';

const Main: FC = () => {
    const chat = useAppSelector(state => state.chat)
    const socketRef = useRef<any>(null);
    const peerRef = useRef<SimplePeer.Instance>();
    const userVideoRef = useRef<HTMLVideoElement>(null);
    const partnerVideoRef = useRef<HTMLVideoElement>(null);
    const dispatch = useAppDispatch()

    useEffect(() => {
        socketRef.current = io('http://localhost:5000'); // Замените на адрес вашего сервера


        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            console.log(stream.getTracks());
            if (userVideoRef.current) {
                userVideoRef.current.srcObject = stream;
            }
            peerRef.current = new SimplePeer({
                initiator: true,
                stream: stream,
                trickle: false,
            });

            peerRef.current.on('signal', (data) => {
                console.log('Сигнал (SDP или ICE кандидаты) для отправки:', data);
                socketRef.current?.emit('signal', JSON.stringify(data));
            });

            peerRef.current.on('stream', (remoteStream) => {
                console.log('Получен удаленный поток медиа');
                if (partnerVideoRef.current) {
                    partnerVideoRef.current.srcObject = remoteStream;
                }
            });

            socketRef.current?.on('signal', (data: string) => {
                console.log('Получен сигнал от удаленного пира:', data);
                peerRef.current?.signal(JSON.parse(data));
            })

    

    }).catch((error) => {
        console.error('Error accessing media devices:', error);
    });

    return () => {
        if (peerRef.current) {
            peerRef.current.destroy();
        }
        if (socketRef.current !== null) {
            socketRef.current.disconnect();
        }

    };

}, []);
return (
    <div className={`f-c-col wrapper w-100p ${styles.chatArea}`}>
        <div className={`f-1 w-100p h-100p chatAreaBlock f-column-betw gap-50`}>
            <div className="videoAreas f-1 d-f jc-between gap-40">
                <div className={`videoArea ${chat.isSearching ? "isSearchingVideo" : ""} f-1 f-c-col`}>
                    {
                        chat.isSearching ? <p className={"searchingText"}>Ищем собеседника...</p> : null
                    }
                    <video autoPlay
                        playsInline
                        muted className={"f-1 w-100p h-100p"} ref={partnerVideoRef}></video>

                </div>
                <div className="videoArea f-1 f-c-col">

                    <video autoPlay

                        muted className={"f-1 w-100p h-100p"} ref={userVideoRef}></video>
                </div>
            </div>
            <div className="controlsArea w-100p gap-40 f-row-betw">
                <div className="controlBtn f-1 blueBtn">
                    Следующий собеседник
                </div>
                <div className="controlBtn f-1 redBtn">
                    Выйти
                </div>
            </div>
        </div>
    </div>
);
};

export default Main;