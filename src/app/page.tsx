import Categories from "./components/Categories";
import CustomSection from "./components/CustomSection";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import ProcessAndContact from "./components/ProcessAndContact";
import ProjectsAndQuality from "./components/ProjectsAndQuality";


export default function Home() {
  return (
    <>
       
      <Hero />
      <Categories />
      <CustomSection />
      <ProjectsAndQuality />
      <ProcessAndContact />
    </>
  );
}