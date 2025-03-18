// import ListingForm from "./form"; // Import from the same directory

// const CreateListingPage = () => {
//   const handleSubmit = async (formData: any) => {
//     console.log("Form submitted:", formData);

//     try {
//       const response = await fetch("/api/listings", {
//         method: "POST",
//         body: JSON.stringify(formData),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       const data = await response.json();
//       if (!response.ok) {
//         console.error("Error creating listing:", data.error);
//       } else {
//         console.log("Listing created successfully:", data);
//       }
//     } catch (error) {
//       console.error("Error submitting form:", error);
//     }
//   };

//   return <ListingForm onSubmit={handleSubmit} />;
// };

// export default CreateListingPage;
import ListingForm from "./form";

const CreateListingPage = () => {
  return <ListingForm />;
};

export default CreateListingPage;
