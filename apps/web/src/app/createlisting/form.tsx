// "use client"; // Ensures it runs on the client side

// import { useState } from "react";
// import { TextField, Button, Container } from "@mui/material";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";

// const ListingForm = ({ onSubmit }: { onSubmit: (data: any) => void }) => {
//   const [title, setTitle] = useState("");
//   const [endTime, setEndTime] = useState<Date | null>(null);

//   const handleSubmit = (event: React.FormEvent) => {
//     event.preventDefault();
//     if (!endTime) return;
//     onSubmit({ title, endTime: endTime.toISOString() }); // ✅ Convert Date to String before submission
//   };

//   return (
//     <Container>
//       <form onSubmit={handleSubmit}>
//         <TextField
//           label="Title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           fullWidth
//           required
//         />

//         <LocalizationProvider dateAdapter={AdapterDateFns}>
//           <DateTimePicker
//             label="End Time"
//             value={endTime}
//             onChange={setEndTime}
//             slotProps={{ textField: { fullWidth: true } }} // ✅ Replaces `renderInput`
//           />
//         </LocalizationProvider>

//         <Button type="submit" variant="contained" color="primary">
//           Create Listing
//         </Button>
//       </form>
//     </Container>
//   );
// };

// export default ListingForm;

"use client";

import { useState } from "react";
import { TextField, Button, Container } from "@mui/material";

const ListingForm = () => {
  const [title, setTitle] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Form submitted:", { title });
  };

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          required
        />
        <Button type="submit" variant="contained" color="primary">
          Create Listing
        </Button>
      </form>
    </Container>
  );
};

export default ListingForm;
