import { BrowserRouter, Route, Routes } from "react-router";
import { Home } from "./components/Home";
import Login from "./components/Login";
import { Provider } from "react-redux";
import store from "./store/configureStore";
import { Profile } from "./components/Profile";
import { Feed } from "./components/Feed";
import { Connections } from "./components/Connections";
import { Chat } from "./components/Chat";
import Premium from "./components/Premium";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter basename={"/"}>
        <Routes>
          <Route path="/" element={<Home />}>
            <Route path="/login" element={<Login />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/connections" element={<Connections />} />
            <Route path="/chat/:targetUserId" element={<Chat />} />
            <Route path="/premium" element={<Premium />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
