import Image from "next/image";

export function GCloudLogo({ width = 300, height = 150 }: { width?: number; height?: number }) {
    return (
        <Image
            src="/GCloud.svg"
            alt="Google Cloud Logo"
            width={width}
            height={height}
            className="w-full h-full"
        />
    );
}

export function KFUPMLogo({ width = 280, height = 140 }: { width?: number; height?: number }) {
    return (
        <Image
            src="/KFUPM.svg"
            alt="KFUPM Logo"
            width={width}
            height={height}
            className="w-full h-full"
        />
    );
}

export function IntelligentPlanetLogo({ width = 500, height = 250 }: { width?: number; height?: number }) {
    return (
        <Image
            src="/Intelligent_Planet_logo.svg"
            alt="Intelligent Planet Hackathon Logo"
            width={width}
            height={height}
        />
    );
}

export default function Logos() {
    return (
        <div className="flex flex-col gap-3 w-fit">
            <div className="flex items-center justify-around h-7">
                <KFUPMLogo />
                <p className="text-white font-bold text-lg">|</p>
                <GCloudLogo />
            </div>
            <IntelligentPlanetLogo />
        </div>
    );
}