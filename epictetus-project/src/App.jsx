import { useEffect } from "react";
import { supabase } from "./supabase";

function App() {

  useEffect(() => {

    async function testConnection(){

      const { data, error } = await supabase
        .from("competitions")
        .select("*");


      console.log("DATA:", data);
      console.log("ERROR:", error);

    }


    testConnection();

  }, []);


  return (
    <div>
      <h1>Supabase Test</h1>
    </div>
  );
}

export default App;