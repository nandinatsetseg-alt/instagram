"use client"

import { Input } from "@/components/ui/input";
import { supabaseClient } from "@/supabase";
import { useState } from "react";

export default function Home() {
    const [file, setFile] = useState(null);
    const supabase = supabaseClient();
    const handleFile = async (e) => {
        console.log(e.target.files[0]);
        setFile(e.target.files[0]);
       const response = await supabase.storage.from("POST_IMAGES").upload(`images/${e.target.files[0].name}`, e.target.files[0])
       console.log(response, "response");
       const{data} = supabase.storage.from("POST_IMAGES").getPublicUrl(`images/${e.target.files[0].name}`)
       console.log(data)
    }
    console.log(file)
  return (
   <div>
    <Input type="file" onChange={(e) => handleFile(e)} />
   </div>
  );
}
