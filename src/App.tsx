import "./App.css";
import { controller } from '@/lib/StatesController';
import { useSelector } from 'react-redux';
import AddDialog from "@/components/custom/AddDialog";
import Header from "@/components/custom/Header";
import UrlList from "@/components/custom/UrlList";
import EditDialog from "@/components/custom/EditDialog";
import ExportDialog from "@/components/custom/ExportDialog";
import HelperTexts from "@/components/custom/HelperTexts";
import ImportDialog from "@/components/custom/ImportDialog";
import { useEffect } from "react";
import { Constants } from "@/lib/Constants";

function App() {
  const states = useSelector(() => controller.states);

  useEffect(() => {
    try {
      const urls = JSON.parse(localStorage.getItem(Constants.STORAGE) ?? "[]")
      controller.setState({
        urls: urls,
      })
    }
    catch (e) {
      //
    }
  }, [])

  return (
    <div className="flex min-h-screen w-full flex-col">
      <AddDialog />
      <EditDialog />
      <ExportDialog />
      <ImportDialog />

      <Header />
      <HelperTexts />
      <UrlList />
    </div>
  );
}

export default App;
