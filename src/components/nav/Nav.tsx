'use client';
import logo from '@/public/assets/logo.svg';
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from '@nextui-org/react';
import { SignOut, User } from '@phosphor-icons/react';
import { UserContext } from '@src/providers/user-provider/UserProvider';
import { APIOperation } from '@src/services/api-services/common';
import { clientRequest } from '@src/services/api-services/requests/client-side';
import { ParamsType } from '@src/types/params.type';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { FunctionComponent, ReactElement, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import LangSwitcher from './LangSwitcher';
import ThemeSwitcher from './ThemeSwitcher';

const Nav: FunctionComponent<ParamsType> = ({ params }): ReactElement => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const { user, setUser } = useContext(UserContext);

  const [menuItems, setMenuItems] = useState<{ label: string; href: string; active: boolean; hidden: boolean }[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setMenuItems([
      {
        label: t('navbar:menuLabels.chat'),
        href: '/chat',
        active: pathname.endsWith('chat'),
        // add some form of logged in state
        // hidden: !session?.user,
        hidden: false,
      },
      {
        label: t('navbar:menuLabels.about'),
        href: '/about',
        active: pathname.endsWith('about'),
        hidden: false,
      },
    ]);
  }, [pathname, t]);

  const logout = async (): Promise<void> => {
    const res = await clientRequest({ op: APIOperation.LOGOUT });
    if (!res.success) {
      return;
    }
    setUser(undefined);
    router.push('/login');
  };

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} isMenuOpen={isMenuOpen} isBordered>
      <NavbarContent>
        <NavbarMenuToggle aria-label={isMenuOpen ? 'Close menu' : 'Open menu'} className="sm:hidden" />
        <NavbarBrand>
          <Link href="/">
            <Image className="dark:invert" src={logo} alt="Easyflow" width={40} height={40} />
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden gap-4 sm:flex" justify="start">
        {menuItems
          .filter(item => !item.hidden)
          .map((item, index) => (
            <NavbarItem key={`${item.label}-${index}`} className="px-1">
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
        {user ? (
          <NavbarItem>
            <Dropdown>
              <DropdownTrigger>
                <Avatar
                  className="hover:cursor-pointer"
                  src={user.profilePicture}
                  alt={user.name}
                  name={user.name}
                  isBordered
                />
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownSection showDivider>
                  <DropdownItem key={'profile'} startContent={<User />} href="/profile">
                    {t('navbar:userMenuLabels.profile')}
                  </DropdownItem>
                </DropdownSection>
                <DropdownSection title={t('navbar:userMenuLabels.dangerZone')}>
                  <DropdownItem
                    key={'logout'}
                    className="text-danger"
                    color="danger"
                    startContent={<SignOut />}
                    onClick={() => logout()}
                  >
                    {t('navbar:userMenuLabels.logout')}
                  </DropdownItem>
                </DropdownSection>
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
        ) : (
          <>
            <NavbarItem className="max-sm:hidden">
              <Button as={Link} href="/login" color="secondary" variant="flat">
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
        {menuItems
          .filter(item => !item.hidden)
          .map((item, index) => (
            <NavbarMenuItem key={`${item.label}-${index}`}>
              <Link
                color={item.active ? 'primary' : 'foreground'}
                className="w-full"
                href={item.href}
                size="lg"
                onClick={() => setIsMenuOpen(false)}
              >
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
            onClick={() => setIsMenuOpen(false)}
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
            onClick={() => setIsMenuOpen(false)}
          >
            {t('navbar:menuLabels.signup')}
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
};

export default Nav;
