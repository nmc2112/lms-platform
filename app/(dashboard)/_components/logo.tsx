import Image from "@/node_modules/next/image"
export const Logo = () => {
    return(
        <Image
            height={130}
            width={130}
            alt="logo"
            src="/logo.svg"
        />
    )
}