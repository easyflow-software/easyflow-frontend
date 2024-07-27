'use client';
import { UserContext } from '@/src/providers/user-provider/UserProvider';
import { ParamsType } from '@/src/types/params.type';
import {
  Avatar,
  Button,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from '@nextui-org/react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FunctionComponent, ReactElement, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import LangSwitcher from './LangSwitcher';
import ThemeSwitcher from './ThemeSwitcher';

const Nav: FunctionComponent<ParamsType> = ({ params }): ReactElement => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation('navbar');
  const pathname = usePathname();
  const { user, profilePicture } = useContext(UserContext);

  const [menuItems, setMenuItems] = useState<{ label: string; href: string; active: boolean }[]>([]);

  useEffect(() => {
    setMenuItems([
      {
        label: t('navbar:menuLabels.chat'),
        href: '/chat',
        active: pathname.endsWith('chat'),
      },
      {
        label: t('navbar:menuLabels.pricing'),
        href: '/pricing',
        active: pathname.endsWith('pricing'),
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle aria-label={isMenuOpen ? 'Close menu' : 'Open menu'} className="sm:hidden" />
        <NavbarBrand>
          <Image src="/logo.svg" alt="Easyflow" width={40} height={40} />
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden gap-4 sm:flex" justify="center">
        {menuItems.map((item, index) => (
          <NavbarItem key={`${item.label}-${index}`}>
            <Link color={item.active ? 'primary' : 'foreground'} href={item.href}>
              {item.label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <ThemeSwitcher />
        </NavbarItem>
        <NavbarItem>
          <LangSwitcher params={params} />
        </NavbarItem>
        {user || profilePicture ? (
          <NavbarItem>
            {/* TODO: add s3 integration for profilepictures in backend and past url */}
            <Avatar src="" name={user?.name} />
          </NavbarItem>
        ) : (
          <>
            <NavbarItem className="max-sm:hidden">
              <Button as={Link} href="/login" variant="flat">
                {t('navbar:menuLabels.login')}
              </Button>
            </NavbarItem>
            <NavbarItem className="max-sm:hidden">
              <Button as={Link} color="primary" href="/signup">
                {t('navbar:menuLabels.signup')}
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.label}-${index}`}>
            <Link color={item.active ? 'primary' : 'foreground'} className="w-full" href={item.href} size="lg">
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
        <NavbarMenuItem>
          <Link
            color={pathname.endsWith('/login') ? 'primary' : 'foreground'}
            className="w-full"
            href="/login"
            size="lg"
          >
            {t('navbar:menuLabels.login')}
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            color={pathname.endsWith('/signup') ? 'primary' : 'foreground'}
            className="w-full"
            href="/signup"
            size="lg"
          >
            {t('navbar:menuLabels.signup')}
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
};

export default Nav;
