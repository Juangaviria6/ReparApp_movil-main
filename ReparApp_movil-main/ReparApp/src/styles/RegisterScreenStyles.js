import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 40,
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 24,
    top: 20,
    padding: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#059669",
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
    marginTop: 8,
  },
  form: {
    paddingHorizontal: 24,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
  },
  registerButton: {
    backgroundColor: "#059669",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  registerButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default styles;