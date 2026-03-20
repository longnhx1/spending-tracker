import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import useStore from "../store/useStore";
import { HomeIcon, StatsIcon, PlusIcon, DebtIcon, BudgetIcon } from "./icons";

const NAV_ITEMS = [
  { Icon: HomeIcon, label: "Trang chủ", route: "/" },
  { Icon: StatsIcon, label: "Thống kê", route: "/stats" },
  { isPlus: true },
  { Icon: DebtIcon, label: "Nợ", route: "/debt" },
  { Icon: BudgetIcon, label: "Ngân sách", route: "/budget" },
];

export default function NavBar({ activeRoute }) {
  const router = useRouter();
  const colors = useStore((s) => s.colors);

  return (
    <View
      style={[
        styles.nav,
        { backgroundColor: colors.bg1, borderTopColor: colors.border },
      ]}
    >
      {NAV_ITEMS.map((item) => {
        if (item.isPlus) {
          return (
            <TouchableOpacity
              key="plus"
              style={styles.item}
              onPress={() => router.push("/add")}
            >
              <View style={[styles.plusBtn, { backgroundColor: colors.accent }]}>
                <PlusIcon size={22} color="#fff" />
              </View>
              <Text style={[styles.label, { color: colors.accent }]}>Thêm</Text>
            </TouchableOpacity>
          );
        }

        const isActive = item.route === activeRoute;
        const iconColor = isActive ? colors.accent : colors.text3;
        return (
          <TouchableOpacity
            key={item.label}
            style={styles.item}
            onPress={() => {
              if (!isActive) router.push(item.route);
            }}
          >
            <item.Icon size={20} color={iconColor} />
            <View
              style={[
                styles.dot,
                isActive && { backgroundColor: colors.accent, opacity: 1 },
              ]}
            />
            <Text
              style={[
                styles.label,
                { color: isActive ? colors.accent : colors.text3 },
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    borderTopWidth: 0.5,
    paddingTop: 8,
    paddingBottom: 28,
    paddingHorizontal: 4,
  },
  item: {
    flex: 1,
    alignItems: "center",
    gap: 3,
  },
  plusBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "transparent",
    opacity: 0,
  },
  label: {
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
