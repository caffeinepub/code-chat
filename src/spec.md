# Specification

## Summary
**Goal:** Implement code-only authentication system that allows users to log in using just their unique numeric code, removing the Internet Identity requirement.

**Planned changes:**
- Store user sessions in backend that map unique codes to user identities
- Auto-authenticate users immediately after registration with their unique code
- Create simplified login page with single code input field
- Remove Internet Identity authentication from Header, ConnectPage, and ChatPage
- Implement persistent session storage using browser local storage
- Enable cross-device authentication using the same unique code

**User-visible outcome:** Users can register once to receive a unique code, then log in from any device by simply entering that code. No password, Internet Identity, or additional verification required. Sessions persist across browser restarts until explicit logout.
