import Link from "next/link";
import Image from "next/image";

interface PaymentOptionLinkProps {
  deeplink: string;
  imagePath: string;
  altText: string;
}

const PaymentOptionLink: React.FC<PaymentOptionLinkProps> = ({
  deeplink,
  imagePath,
  altText,
}) => (
  <Link href={deeplink}>
    <Image src={imagePath} alt={altText} width={45} height={45} />
  </Link>
);

export default PaymentOptionLink;
