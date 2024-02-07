/* import { UserButton } from "@clerk/nextjs"; */
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div >
      <div className="my-3">
      <Link href="/user" > 

      <Image src="./svgs/user.svg" alt="logo" width=
                        {35} height={35} className="opacity-85 hover:opacity-100  transition-all duration-300  float-left gap-3  mt-1 cursor-pointer " />
            </Link>


        <input type="text" name="" placeholder="Commencer un Whisper.." className="bg-navcolor  rounded-full pl-3 pr-28 pt-3 outline-none text-white " />
        <button className="float-right right-2 mr-2 bg-white rounded-full py-2 px-4 hover:bg-slate-200 transition-all duration-150">Publier</button>
      </div>

      <div className="opacity-95 rounded-3xl hover:opacity-100 transition-all duration-300 py-2">
        < hr className="border-x-2" />
        <p className="text-white py-8 px-3">Yo les gars</p>
        <img src="./test.jpg" alt="" className="rounded-3xl" />
      </div>
      <div className="opacity-95 rounded-3xl hover:opacity-100 transition-all duration-300 py-2">
      < hr className="border-x-2" />
        <p className="text-white py-8 px-3">Yo les gars</p>

        <img src="./test.jpg" alt="" className="rounded-3xl" />
      </div>
      <div className="opacity-95 rounded-3xl hover:opacity-100 transition-all duration-300 py-2">
      < hr className="border-x-2" />
        <p className="text-white py-8 px-3">Yo les gars</p>

        <img src="./test.jpg" alt="" className="rounded-3xl" />
      </div>
      <div className="opacity-95 rounded-3xl hover:opacity-100 transition-all duration-300 py-2">
      < hr className="border-x-2" />
        <p className="text-white py-8 px-3">Yo les gars</p>

        <img src="./test.jpg" alt="" className="rounded-3xl" />
      </div>
      <div className="opacity-95 rounded-3xl hover:opacity-100 transition-all duration-300 py-2">
      < hr className="border-x-2" />
        <p className="text-white py-8 px-3">Yo les gars</p>

        <img src="./test.jpg" alt="" className="rounded-3xl" />
      </div>
    </div>
  )
}
