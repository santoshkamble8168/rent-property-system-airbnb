import Container from "@/components/common/Container";
import EmptyState from "@/components/common/EmptyState";
import getListings, { IlistingParams } from "./actions/getListings";
import ListingCard from "@/components/listing/ListingCard";
import getCurrentUser from "./actions/getCurrentUser";

interface HomeProps {
	searchParams: IlistingParams;
}

const Home = async ({ searchParams }: HomeProps) => {
	const listings = await getListings(searchParams);
	const currentUser = await getCurrentUser();

	const isEmpty = true;

	if (listings?.length === 0) {
		return <EmptyState showReset />;
	}

	return (
		<Container>
			<div className="pt-24 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
				{listings.map((property) => (
					<ListingCard key={property.id} data={property} currentUser={currentUser} />
				))}
			</div>
		</Container>
	);
};

export default Home;
