import { Link as StyledLink, LinkProps as StyledLinkProps } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { FunctionComponent, ReactElement } from 'react';

interface LinkProps extends StyledLinkProps {
  href: string;
}

const Link: FunctionComponent<LinkProps> = ({ href, ...props }): ReactElement => {
  const router = useRouter();

  return <StyledLink onClick={() => router.push(href)} {...props} />;
};

export default Link;
