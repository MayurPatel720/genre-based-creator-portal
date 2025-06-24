import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const abt = async () => {
	const response = await axios.get("http://localhost:3000");
	return response.data;
};

const Demo = () => {
	const { data, isLoading, error } = useQuery({
		queryKey: ["demo"],
		queryFn: abt,
	});

	if (isLoading) return <p>Loading...</p>;
	if (error) return <p>Error loading data</p>;

	return (
		<>
			<p>{JSON.stringify(data)}</p>
		</>
	);
};

export default Demo;
