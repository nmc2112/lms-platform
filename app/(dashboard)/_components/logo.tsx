import Image from "@/node_modules/next/image"
export const Logo = () => {
    return(
        <Image
            height={40}
            width={40}
            alt="logo"
            src="/logo.png"
        />
    )
}