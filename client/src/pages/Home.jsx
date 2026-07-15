import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import Companies from "../components/Companies";
import LatestJobs from "../components/LatestJobs";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Stats />
      <Companies />
      <LatestJobs />
      <Footer />
    </>
  );
}

export default Home;