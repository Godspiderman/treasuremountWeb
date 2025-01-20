"use client";

import { Provider } from "react-redux";
import store from "../../redux/store";
import GlobalLoader from "../GlobalLoader/page";

export default function ClientProvider({ children }) {
  return (
    <Provider store={store}>
      <GlobalLoader />
      {children}
    </Provider>
  );
}
