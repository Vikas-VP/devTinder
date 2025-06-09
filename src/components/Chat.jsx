import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { createSocketConnection } from "../utils/Socket";
import { useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { timeAgo } from "../utils/dateTimeFun";

export const Chat = () => {
  const { targetUserId } = useParams();
  const msgRef = useRef(null);
  const [inputTxt, setInputTxt] = useState("");
  const [messages, setMessages] = useState([]);
  const user = useSelector((store) => store.user);
  const fromUserId = user?._id;
  const userName = user?.firstName;

  const getNode = () => {
    if (!msgRef.current) {
      msgRef.current = new Map();
    }
    return msgRef.current;
  };

  const fetchMessages = async () => {
    const response = axios
      .get(`${BASE_URL}/chat/${targetUserId}`, {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res, "response");
        const chatMsg = res?.data?.data?.messages?.map((msg) => {
          return {
            fromUserId: msg?.senderId?._id,
            message: msg?.text,
            userName: msg?.senderId?.firstName,
            id: msg?._id,
            createdAt: msg?.createdAt,
          };
        });

        setMessages([...chatMsg]);
      });
  };

  useEffect(() => {
    if (!user) return;
    const socket = createSocketConnection();
    socket.emit("joinChat", { userName, fromUserId, targetUserId });
    socket.on(
      "messageRecived",
      ({ userName, fromUserId, targetUserId, message }) => {
        setMessages((msg) => [...msg, { fromUserId, message, userName }]);
      }
    );

    return () => {
      socket.disconnect();
    };
  }, [user, targetUserId]);

  useEffect(() => {
    fetchMessages();
  }, []);

  console.log(messages, "msg");

  const sendMessage = () => {
    const socket = createSocketConnection();
    socket.emit("sendMessage", {
      userName,
      fromUserId,
      targetUserId,
      message: inputTxt,
    });
    setInputTxt("");
  };

  useEffect(() => {
    const getLastMsgRef = getNode();
    const lastNode = getLastMsgRef.get(messages[messages?.length - 1]?.id);
    lastNode?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [messages]);

  return (
    <div className="w-full max-w-2xl h-[80vh] mx-auto flex flex-col border border-base-300 rounded-lg shadow-md bg-base-100">
      {/* Header */}
      <div className="p-4 border-b border-base-300 bg-base-200 text-xl font-semibold">
        💬 Chat with Us
      </div>

      {/* Chat body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Incoming message */}
        {messages?.map((msg) => {
          return (
            <div
              className={`chat chat-${
                msg?.fromUserId === fromUserId ? "end" : "start"
              }`}
              key={msg?.id}
              ref={(node) => {
                if (node) {
                  let msgMap = getNode();
                  msgMap.set(msg?.id, node);
                }
              }}
            >
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  <img src="https://api.dicebear.com/6.x/personas/svg?seed=Anakin" />
                </div>
              </div>
              <div className="chat-header">
                {msg?.fromUserId === fromUserId ? "You" : msg?.userName}
                <time className="text-xs opacity-50 ml-2">
                  {timeAgo(msg?.createdAt || new Date())}
                </time>
              </div>
              <div className="chat-bubble bg-base-300">{msg?.message}</div>
            </div>
          );
        })}
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-base-300 bg-base-200 flex items-center gap-3">
        <input
          type="text"
          placeholder="Type your message…"
          className="input input-bordered input-sm w-full"
          value={inputTxt}
          onChange={(e) => setInputTxt(e.target.value)}
        />
        <button className="btn btn-secondary btn-sm" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};
