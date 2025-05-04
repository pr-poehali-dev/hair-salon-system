
import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import AdminPanel from './AdminPanel';

const AdminPage = () => {
  return <AdminPanel />;
};

export default AdminPage;
