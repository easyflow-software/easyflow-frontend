'use client';
import { serverLogout } from '@/src/app/[locale]/actions';
import { UserContext } from '@/src/providers/user-provider/UserProvider';
import { ParamsType } from '@/src/types/params.type';
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
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { FunctionComponent, ReactElement, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import LangSwitcher from './LangSwitcher';
import ThemeSwitcher from './ThemeSwitcher';

const Nav: FunctionComponent<ParamsType> = ({ params }): ReactElement => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();
  const pathname = usePathname();
  const { user, profilePicture, setUser, setProfilePicture } = useContext(UserContext);
  const router = useRouter();

  const [menuItems, setMenuItems] = useState<{ label: string; href: string; active: boolean; hidden: boolean }[]>([]);

  useEffect(() => {
    setMenuItems([
      {
        label: t('navbar:menuLabels.chat'),
        href: '/chat',
        active: pathname.endsWith('chat'),
        hidden: !user,
      },
      {
        label: t('navbar:menuLabels.pricing'),
        href: '/pricing',
        active: pathname.endsWith('pricing'),
        hidden: false,
      },
      {
        label: t('navbar:menuLabels.about'),
        href: '/about',
        active: pathname.endsWith('about'),
        hidden: false,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, user]);

  const logout = async (): Promise<void> => {
    const res = await serverLogout();
    if (!res.success) {
      console.error('Failed to logout', res.errorCode);
      return;
    }
    setUser(undefined);
    setProfilePicture(undefined);
    router.push('/');
  };

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} isMenuOpen={isMenuOpen} isBordered>
      <NavbarContent>
        <NavbarMenuToggle aria-label={isMenuOpen ? 'Close menu' : 'Open menu'} className="sm:hidden" />
        <NavbarBrand>
          <Link href="/">
            <Image className="dark:invert" src="/assets/logo.svg" alt="Easyflow" width={40} height={40} />
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
        {user || profilePicture ? (
          <NavbarItem>
            {/* TODO: add s3 integration for profilepictures in backend and past url */}
            <Dropdown>
              <DropdownTrigger>
                <Avatar
                  className="hover:cursor-pointer"
                  src={profilePicture}
                  alt={user?.name}
                  name={user?.name}
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
