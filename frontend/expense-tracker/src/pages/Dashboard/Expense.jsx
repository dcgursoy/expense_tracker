import React from 'react'
import { useUserAuth } from '../../hooks/useUserAuth'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { API_PATHS } from '../../utils/apiPaths'
import { useState } from 'react'
import toast from 'react-hot-toast'
import axiosInstance from '../../utils/axiosInstance'
import { useEffect } from 'react'
import ExpenseOverview from '../../components/Expense/ExpenseOverview'
import Modal from '../../components/Modal'
import AddExpenseForm from '../../components/Expense/AddExpenseForm'
import ExpenseList from '../../components/Expense/ExpenseList'
import DeleteAlert from '../../components/DeleteAlert'

const Expense = () => {

  useUserAuth();

  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });
  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);

  //Get All Expense Details
  const fetchExpenseDetails = async () => {
    if (loading) return;

    setLoading(true);
    
    try {
      const response = await axiosInstance.get(
        `${API_PATHS.EXPENSE.GET_ALL_EXPENSE}`
      );

      if(response.data) {
        setExpenseData(response.data);
      }
    } catch (error) {
      console.log("Something went wrong. Please try again.", error);
    } finally {
      setLoading(false);
    }
  };

  //Handle Add Expense
  const handleAddExpense = async (expense) => {
    const {category, amount, date, icon} = expense;

    //Validation checks
    if(!category.trim()) {
      toast.error("Category is required");
      return;
    }

    if(!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Amount should be a valid number greater than 0");
      return;
    }

    if (!date) {
      toast.error("Date is required");
      return;
    }

    try {
      await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
        category,
        amount,
        date,
        icon,
      });

      setOpenAddExpenseModal(false);
      toast.success("Expense added successfully");
      fetchExpenseDetails();
    } catch (error) {
      console.error(
        "Error adding expense:",
        error.response?.data?.message || error.message
      );
    }
  };

  //Delete Expense
  const deleteExpense = async(id) => {
    try {
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));

      setOpenDeleteAlert({ show: false, data: null});
      toast.success("Expense details deleted successfully");
      fetchExpenseDetails();
    } catch (error) {
      console.error(
        "Error deleting expense:",
        error.response?.data?.message || error.message
      );
    }
  };

  // handle download expense details
  const handleDownloadExpenseDetails = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.EXPENSE.DOWNLOAD_EXPENSE,
        {
          responseType: "blob",
        }
      );

      //Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "expense_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading expense details:", error);
      toast.error("Failed to download expense details. Please try again.");
    }
  };

  useEffect(() => {
    fetchExpenseDetails();

    return () => {};
  }, []);


  return (
    <DashboardLayout activeMenu = "Expense">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Expense Management 💸
          </h1>
          <p className="text-gray-600">Track and manage your spending habits</p>
        </div>

        {/* Expense Overview Card */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-8 text-white shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Expense Overview</h2>
              <p className="text-red-100">Monitor your spending and expense trends</p>
            </div>
            <button
              onClick={() => setOpenAddExpenseModal(true)}
              className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2"
            >
              <span>+</span>
              Add Expense
            </button>
          </div>
          
          <div className="bg-white/10 rounded-xl p-6">
            <ExpenseOverview
              transactions = {expenseData}
              onExpenseIncome = {() => setOpenAddExpenseModal(true)}
            />
          </div>
        </div>

        {/* Expense List Card */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Expense History</h3>
            <button
              onClick={handleDownloadExpenseDetails}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
            >
              📥 Download
            </button>
          </div>
          
          <ExpenseList
            transactions = {expenseData}
            onDelete = {(id) => {
              setOpenDeleteAlert({ show: true, data: id });
            }}
            onDownload = {handleDownloadExpenseDetails}
          />
        </div>

        <Modal
          isOpen = {openAddExpenseModal}
          onClose = {() => setOpenAddExpenseModal(false)}
          title = "Add Expense"
        >
          <AddExpenseForm onAddExpense={handleAddExpense} />
        </Modal>

        <Modal
          isOpen = {openDeleteAlert.show}
          onClose = {() => setOpenDeleteAlert({ show: false, data: null})}
          title = "Delete Expense"
        >
          <DeleteAlert
            content = "Are you sure you want to delete this expense detail?"
            onDelete = {() => deleteExpense(openDeleteAlert.data)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Expense