"use client";

import { Provider } from "react-redux";
import store from "../../redux/store";
import GlobalLoader from "../GlobalLoader/page";
import "../../utils/i18n";

export default function ClientProvider({ children }) {
  return (
    <html lang="tn">
      <body>
    <Provider store={store}>
      <GlobalLoader />
      {children}
    </Provider>
      </body>
      </html>
  );
}
