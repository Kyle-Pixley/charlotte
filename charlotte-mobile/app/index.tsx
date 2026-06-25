import { View } from "react-native";
import DashBoard from "@/components/DashBoard";

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-black">
      <DashBoard />
    </View>
  );
}