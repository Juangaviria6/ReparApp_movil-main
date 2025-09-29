import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e293b",
  },
  section: {
    backgroundColor: "white",
    marginHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: "#f0fdf4",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1e293b",
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: "#64748b",
  },
  settingRight: {
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    marginHorizontal: 24,
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#fee2e2",
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#ef4444",
    marginLeft: 8,
  },
});

export default styles;