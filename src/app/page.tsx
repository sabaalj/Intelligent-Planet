import Image from "next/image";
import { LiquidGlassCard } from "@/components/ui/liquid-glass";
import { Cloud } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen p-16 items-start justify-start font-sans bg-black">
      <main className="relative z-10 items-start">
        <div className="flex flex-col gap-6">
          <div className="flex gap-5">
            <Image
              src="/KFUPM.svg"
              alt="KFUPM Logo"
              width={200}
              height={100}
            />

            <p className="text-white font-bold text-2xl">|</p>

            <Image
              src="/GCloud.svg"
              alt="Google Cloud Logo"
              width={200}
              height={100}
            />
          </div>

          <Image
            src="/Intelligent_Planet_logo.svg"
            alt="Intelligent Planet Hackathon Logo"
            width={500}
            height={250}
          />

          <p className="text-gray-50 font-bold text-2xl">AI Solutions for an Intelligent Planet.</p>

          <LiquidGlassCard
            shadowIntensity='xs'
            borderRadius='32px'
            glowIntensity='none'
            className='px-10 py-4 text-white bg-white/8 w-fit'
          >
            <div className="relative z-30">
              <p className="text-gray-50 font-bold text-2xl">Coming Soon.</p>
            </div>
          </LiquidGlassCard>

        </div>

        <Image
          src="/Globe-Full.png"
          alt="Intelligent Planet Globe"
          width={1500}
          height={750}
          className="fixed bottom-0 right-0 -z-10 translate-x-1/3 translate-y-1/2"
        />

      </main>
    </div>
  );
}
