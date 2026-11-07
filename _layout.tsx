import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import { MenuProvider } from '../context/MenuContext';
import { OrdersProvider } from '../context/orderscontext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <MenuProvider>
        <OrdersProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="login" />
            <Stack.Screen name="menu" />
            <Stack.Screen name="additem" />
            <Stack.Screen name="orders" />
            <Stack.Screen name="profile" />
          </Stack>
        </OrdersProvider>
      </MenuProvider>
    </AuthProvider>
  );
}