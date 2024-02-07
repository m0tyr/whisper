import TopBar from "@/components/shared/Topbar";

 
async function Page() {
  return(
    <div>
        <div className="">
        <p className="text-white py-5">Change ton pseudo</p>
        <input type="text" placeholder="m0tyr" name="username" id="" className="bg-navcolor  rounded-full pl-6 pr-32 py-3 outline-8 bg-zinc-800 text-white " />
        <input type="submit" value="Changer" className="float-right right-2 mr-2 bg-white rounded-full py-2 px-4 hover:bg-slate-200 transition-all duration-150 cursor-pointer" />
      </div>
      <div className="opacity-90 rounded-3xl hover:opacity-100 transition-all duration-300 py-12">
      BLABLA
      </div>
      <div className="opacity-90 rounded-3xl hover:opacity-100 transition-all duration-300 py-12">
      BLABLA
      </div>
      <div className="opacity-90 rounded-3xl hover:opacity-100 transition-all duration-300 py-12">
      BLABLA
      </div>
      <div className="opacity-90 rounded-3xl hover:opacity-100 transition-all duration-300 py-12">
      BLABLA
      </div>
    </div>
  )
}

export default Page;