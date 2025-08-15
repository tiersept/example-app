import { useAuth } from "@/providers/provider-auth";
import { useForm } from "@tanstack/react-form";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import { Button } from "../button";
import { ThemedText } from "../themed-text";
import { loginSchema } from "./schema";

export default function LoginForm() {
  const { onLogin } = useAuth();

  const form = useForm({
    defaultValues: {
      username: "test@test.test",
      password: "password@123",
    },
    validators: {
      onChange: loginSchema,
    },
    onSubmit: async ({ value }: any) => {
      onLogin &&
        onLogin(
          { username: value.username, password: value.password },
          (error) => {
            Alert.alert(
              "Login Failed",
              error?.message ||
                "An error occurred during login. Please try again.",
              [{ text: "OK" }]
            );
          }
        );
    },
  });

  return (
    <View
      style={styles.container}
      accessible={true}
      accessibilityRole="none"
      accessibilityLabel="Login form for Bankalicious"
    >
      <View style={styles.containerTitle}>
        <ThemedText
          type="h3"
          accessible={true}
          accessibilityRole="header"
          accessibilityLabel="Bankalicious app title"
        >
          Bankalicious
        </ThemedText>
        <ThemedText
          type="small"
          accessible={true}
          accessibilityRole="text"
          accessibilityLabel="Login subtitle"
        >
          Log in to view your riches
        </ThemedText>
      </View>

      <form.Field
        name="username"
        children={(field) => (
          <View style={styles.inputContainer}>
            <ThemedText
              style={styles.label}
              accessible={true}
              accessibilityRole="text"
              accessibilityLabel="Username field label"
            >
              Username
            </ThemedText>
            <TextInput
              style={styles.input}
              placeholder="Enter your username or email"
              value={field.state.value}
              onChangeText={(value) => field.handleChange(value)}
              onBlur={field.handleBlur}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="username"
              textContentType="username"
              returnKeyType="next"
              blurOnSubmit={false}
              accessible={true}
              accessibilityLabel="Username input field"
              accessibilityHint="Enter your username or email address"
              accessibilityRole="text"
              accessibilityState={{
                disabled: false,
              }}
              accessibilityValue={{
                text: field.state.value || "",
              }}
            />
            {field.state.meta.errors && field.state.meta.errors.length > 0 && (
              <Text
                style={styles.errorText}
                accessible={true}
                accessibilityRole="alert"
                accessibilityLabel="Username error message"
              >
                {field.state.meta.errors
                  .map((error, index) =>
                    typeof error === "string"
                      ? error
                      : error?.message || "Invalid input"
                  )
                  .join(", ")}
              </Text>
            )}
          </View>
        )}
      />

      <form.Field
        name="password"
        children={(field) => (
          <View style={styles.inputContainer}>
            <ThemedText
              style={styles.label}
              accessible={true}
              accessibilityRole="text"
              accessibilityLabel="Password field label"
            >
              Password
            </ThemedText>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              value={field.state.value}
              onChangeText={(value) => field.handleChange(value)}
              onBlur={field.handleBlur}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="password"
              textContentType="password"
              returnKeyType="done"
              accessible={true}
              accessibilityLabel="Password input field"
              accessibilityHint="Enter your password"
              accessibilityRole="text"
              accessibilityValue={{
                text: field.state.value
                  ? "Password entered"
                  : "No password entered",
              }}
            />
            {field.state.meta.errors && field.state.meta.errors.length > 0 && (
              <Text
                style={styles.errorText}
                accessible={true}
                accessibilityRole="alert"
                accessibilityLabel="Password error message"
              >
                {field.state.meta.errors
                  .map((error, index) =>
                    typeof error === "string"
                      ? error
                      : error?.message || "Invalid input"
                  )
                  .join(", ")}
              </Text>
            )}
          </View>
        )}
      />

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
        children={(state) => {
          const [canSubmit, isSubmitting] = state as [boolean, boolean];
          return (
            <Button
              title={isSubmitting ? "Signing in..." : "Sign in"}
              onPress={form.handleSubmit}
              disabled={!canSubmit}
              accessibilityLabel={
                isSubmitting ? "Signing in, please wait" : "Sign in button"
              }
              accessibilityHint="Tap to sign in to your account"
              accessibilityRole="button"
              style={{ marginTop: 24 }}
            />
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    width: "100%",
  },
  containerTitle: {
    alignItems: "center",
    marginBottom: 64,
  },
  inputContainer: {
    marginBottom: 12,
  },
  label: {
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  errorText: {
    color: "#ff3b30",
    fontSize: 14,
    marginTop: 5,
  },
});
