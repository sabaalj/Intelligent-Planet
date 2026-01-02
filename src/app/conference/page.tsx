import Image from "next/image";
import { LiquidGlassCard } from "@/components/ui/liquid-glass";
import { Navbar } from "@/components/Navbar";

export default function Conference() {
  return (
    <div className="min-h-screen min-w-screen font-san p-4 bg-black">
      <Navbar />
      <main className="">
        <div className="flex flex-col gap-6">
          <div className="flex gap-5">
            <Image
              src="/KFUPM.svg"
              alt="KFUPM Logo"
              width={100}
              height={50}
            />

            <p className="text-white font-bold text-2xl">|</p>

            <Image
              src="/GCloud.svg"
              alt="Google Cloud Logo"
              width={100}
              height={50}
            />
          </div>

          <Image
            src="/Intelligent_Planet_logo.svg"
            alt="Intelligent Planet Hackathon Logo"
            width={250}
            height={125}
          />

          <p className="text-gray-50 font-bold text-2xl">AI Solutions for an Intelligent Planet.</p>

          <LiquidGlassCard
            shadowIntensity='xs'
            borderRadius='25px'
            glowIntensity='xl'
            className='px-10 py-4 text-white bg-white/8 w-full'
          >
            <div className="relative flex justify-center z-30">
              <p className="text-gray-50 font-bold text-2xl">Coming Soon.</p>
            </div>
          </LiquidGlassCard>

        </div>

        <div className="w-96 h-96 overflow-hidden -z-10">
          <Image
              src="/Globe-Full.png"
              alt="Intelligent Planet Globe"
              width={1500}
              height={750}
              className="bottom-0 right-0 -z-10 translate-x-1/3 translate-y-1/2"
          />
        </div>

      </main>
    </div>
  );
}
