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
    const [openModal, setOpenModal] = useState(false);
    const [amount, setAmount] = useState("");
    const [successmsg, setSuccessmsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

  const handleTopUp = async () => {
    setSuccessmsg("");
    setErrorMsg("");

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorMsg("Please enter a valid positive amount.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/managewallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: parsedAmount }),
      });

      if (res.ok) {
        setSuccessmsg("Your wallet balance has topped up successfully!");
        setAmount("");
        setOpenModal(false);
        const walletRes = await fetch("/api/managewallet");
        const walletData = await walletRes.json();
        setWalletBalance(walletData.balance);
      } else {
        const error = await res.json();
        setErrorMsg(error.message || "Your wallet balance unable to top up.");
      }
    } catch (err) {
      setErrorMsg("Failed to connect to the server.");
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

        <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => setOpenModal(true)}>
            Top Up Wallet
          </Button>

          {/* Modal for Top Up */}
          <Modal
            open={openModal}
            onClose={() => setOpenModal(false)}
            closeAfterTransition
          >
            <Fade in={openModal}>
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
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  inputProps={{ min: 0, step: "0.01" }}
                  sx={{ mb: 3 }}
                />

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleTopUp}
                    sx={{ width: "48%" }}
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Top Up"}
                  </Button>
                </Box>
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