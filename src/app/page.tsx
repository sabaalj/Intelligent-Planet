import Image from "next/image";
import { LiquidGlassCard } from "@/components/ui/liquid-glass";
import { Navbar } from "@/app/navbar";
import Logos from "@/components/logos";

export default function Home() {
  return (
    <div className="min-h-screen min-w-screen font-san p-4 bg-black">
      <main className="">
      <Navbar />

        <div className="flex flex-col md:flex-row justify-around" style={{ height: "85vh" }}>
          <div className="flex flex-col gap-6 pt-16">
            <Logos />

            <p className="text-gray-50 font-bold text-2xl">AI Solutions for an Intelligent Planet.</p>

            <LiquidGlassCard
              shadowIntensity='xs'
              borderRadius='25px'
              glowIntensity='none'
              className='px-10 py-4 text-white bg-white/8 w-fit'
              >
              <div className="relative flex justify-center z-30">
                <p className="text-gray-50 font-bold text-2xl">Coming Soon.</p>
              </div>
            </LiquidGlassCard>
          </div>

          <div className="h-full w-8/12 overflow-hidden">
            <Image
              src="/Globe-Full.png"
              alt="Intelligent Planet Globe"
              width={1500}
              height={750}
              loading="eager"
            />
          </div>
        </div>


      </main>
    </div>
  );
}
