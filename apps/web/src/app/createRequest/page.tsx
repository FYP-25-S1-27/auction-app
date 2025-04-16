import dynamic from "next/dynamic";

// Dynamically import the form so it's treated as a client component
const CreateRequestForm = dynamic(() => import("./form"), { ssr: false });

const CreateRequestPage = () => {
  return <CreateRequestForm />;
};

export default CreateRequestPage;
