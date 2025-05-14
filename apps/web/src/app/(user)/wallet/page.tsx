"use client";

import { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Button,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Divider,
    Modal,
    Fade, Alert
  } from "@mui/material";
  import ProfileLayout from "@/libs/components/profileLayout";
  
  interface Transaction {
    id: number;
    listingName: string;
    buyerUsername: string;
    sellerUsername: string;
    salePrice: string;
    transactionDate: string;
  }

  export default function WalletTransactionsPage() {
    const [walletBalance, setWalletBalance] = useState<string>("0.00");
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    // const [openModal, setOpenModal] = useState(false);
    // const [amount, setAmount] = useState("");
    const [topUpAmount, setTopUpAmount] = useState("");
    const [openTopUpModal, setOpenTopUpModal] = useState(false);
    const [successmsg, setSuccessmsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [openWithdrawModal, setOpenWithdrawModal] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState(""); 

    const handleTransaction = async (type: "topup" | "withdraw", amount: string) => {
    setErrorMsg("");
    setSuccessmsg("");

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorMsg("Enter a valid amount.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/managewallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: parsedAmount, type }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessmsg(`Your wallet balance has ${type === "topup" ? "top-up" : "withdraw"} successfully!`);
        setWalletBalance(data.balance);
        setTopUpAmount("");
        setWithdrawAmount("");
        setOpenTopUpModal(false);
        setOpenWithdrawModal(false);
      } else {
        setErrorMsg(data.message || "Transaction failed.");
      }
    } catch (err) {
      console.error("Transaction error:", err);
      setErrorMsg("Server error.");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    // Fetch wallet balance
    async function fetchWallet() {
      try {
        const res = await fetch("/api/managewallet");
        const data = await res.json();
        setWalletBalance(data.balance);
      } catch (error) {
        console.error("Error fetching wallet", error);
      }
    }

    // Fetch transactions
    async function fetchTransactions() {
      try {
        const res = await fetch("/api/transaction");
        const data = await res.json();
        setTransactions(data.transactions);
      } catch (error) {
        console.error("Error fetching transactions", error);
      }
    }

    async function loadData() {
      setLoading(true);
      await Promise.all([fetchWallet(), fetchTransactions()]);
      setLoading(false);
    }

    loadData();
  }, []);

  return (
    <ProfileLayout>
    <Box maxWidth="1000px" mx="auto" mt={4} p={2}>
      <Typography variant="h4" fontWeight="bold" mb={2}>
        Wallet & Transactions
      </Typography>

      {/* Manage wallet */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        {successmsg && <Alert severity="success" sx={{ mb: 2 }}>{successmsg}</Alert>}
        {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}
        <Typography variant="h6" mb={1}>
          Wallet Balance
        </Typography>
        <Typography variant="h5" color="primary" mb={2}>
          ${walletBalance}
        </Typography>

        <Box display="flex" gap={2} mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenTopUpModal(true)}>
            Top Up Wallet
          </Button>
          <Button variant="outlined" color="error" onClick={() => setOpenWithdrawModal(true)}>
            Withdraw balance
          </Button>
        </Box>

          {/* Modal for top up wallet */}
          <Modal
            open={openTopUpModal}
            onClose={() => setOpenTopUpModal(false)}
            closeAfterTransition
          >
            <Fade in={openTopUpModal}>
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 400,
                  bgcolor: "background.paper",
                  boxShadow: 24,
                  p: 4,
                  borderRadius: 2,
                }}
              >
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  Enter an amount to top up
                </Typography>

                <TextField
                  fullWidth
                  label="Enter your amount ($)"
                  type="number"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  inputProps={{ min: 0, step: "0.01" }}
                  sx={{ mb: 3 }}
                />

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleTransaction("topup", topUpAmount)}
                    sx={{ width: "48%" }}
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Top Up"}
                  </Button>
                </Box>
              </Box>
            </Fade>
          </Modal>

          {/* Model for withdraw balance */}
          <Modal open={openWithdrawModal} onClose={() => setOpenWithdrawModal(false)} closeAfterTransition>
            <Fade in={openWithdrawModal}>
              <Box sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 400,
                  bgcolor: "background.paper",
                  boxShadow: 24,
                  p: 4,
                  borderRadius: 2,
                }}>
                <Typography variant="h6">Enter an amount to withdraw</Typography>
                <TextField
                  fullWidth
                  type="number"
                  label="Amount ($)"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  sx={{ mt: 2 }}
                />
                <Button
                  variant="outlined"
                  color="error"
                  sx={{ mt: 2 }}
                  onClick={() => handleTransaction("withdraw", withdrawAmount)}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Withdraw"}
                </Button>
              </Box>
            </Fade>
          </Modal>

      </Paper>

      {/* View transactions */}
      <Typography variant="h6" mb={1}>
        Auction Transaction History
      </Typography>

      <Divider sx={{ mb: 2 }} />

      {loading ? (
        <Typography>Loading...</Typography>
      ) : transactions.length === 0 ? (
        <Typography>No transactions found.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Transaction ID</TableCell>
                <TableCell>Listing Item</TableCell>
                <TableCell>Buyer</TableCell>
                <TableCell>Seller</TableCell>
                <TableCell>Sale Price</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>{tx.id}</TableCell>
                  <TableCell>{tx.listingName}</TableCell>
                  <TableCell>{tx.buyerUsername}</TableCell>
                  <TableCell>{tx.sellerUsername}</TableCell>
                  <TableCell>${tx.salePrice}</TableCell>
                  <TableCell>{new Date(tx.transactionDate).toISOString().split('T')[0]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
    </ProfileLayout>
  );
}