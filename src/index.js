import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";

import App from './App';
import store from "./redux/store";
import RequireAuth from "./components/routing/RequireAuth"

import AdminLogin from "./pages/admin/AdminLogin"
import Dashboard from "./pages/Dashboard"

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route
          path="/dashboard"
          element={
            <RequireAuth role="exam_cell">
              <Dashboard />
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
