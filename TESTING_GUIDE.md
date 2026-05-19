# Testing Guide: New Frontend Features

## 🧪 Quick Test Plan

### Test Environment Setup
```bash
# Start dev server
npm run dev

# Visit http://localhost:3000
```

---

## Test 1: Users Discovery Page

### Location
- URL: `http://localhost:3000/users`
- Navigation: Sidebar → "Discover" link

### Test Steps

#### 1.1 Suggested Users List
- [ ] Page loads without errors
- [ ] "Discover Users" header displays
- [ ] Search input is visible with placeholder
- [ ] Skeleton loaders appear briefly while loading
- [ ] User cards display with:
  - [ ] Avatar (initial letter)
  - [ ] Username
  - [ ] Bio
  - [ ] Follower count
  - [ ] Follow button

#### 1.2 Follow/Unfollow
- [ ] Click "Follow" button on a user
- [ ] Button changes to "Following" immediately (optimistic)
- [ ] User's follower count increases
- [ ] Click "Following" button
- [ ] Button changes back to "Follow"
- [ ] No errors in console

#### 1.3 Search Functionality
- [ ] Type in search input
- [ ] After 300ms, search results appear
- [ ] Results match search query
- [ ] Clear button (X) appears when typing
- [ ] Click clear button
- [ ] Search input empties
- [ ] Suggested users list shows again
- [ ] No errors if search returns no results
- [ ] Empty state displays: "No users found matching '...'"

#### 1.4 Error Handling
- [ ] Check network tab: requests should go to `/api/users/suggested` and `/api/users/search`
- [ ] If backend is down, error state displays with retry button
- [ ] Click retry button
- [ ] Request retries

#### 1.5 User Navigation
- [ ] Click on a user card
- [ ] Navigate to user profile page
- [ ] Profile shows correct user info

---

## Test 2: Edit Profile Page

### Location
- URL: `http://localhost:3000/profile/edit`
- Navigation: Profile page → "Edit" button (only on own profile)

### Test Steps

#### 2.1 Page Load
- [ ] Page loads with back button and "Edit Profile" header
- [ ] Form fields are prefilled with current user data:
  - [ ] Username field has current username
  - [ ] Email field has current email
  - [ ] Bio field has current bio (or empty)
  - [ ] Bio character counter shows current length

#### 2.2 Form Validation

**Username Field**:
- [ ] Leave empty and try to submit
- [ ] Error: "Username is required"
- [ ] Type 1-2 characters
- [ ] Error: "Username must be at least 3 characters"
- [ ] Type 3+ characters
- [ ] Error disappears

**Email Field**:
- [ ] Leave empty and try to submit
- [ ] Error: "Email is required"
- [ ] Type invalid email (e.g., "test@")
- [ ] Error: "Invalid email address"
- [ ] Type valid email
- [ ] Error disappears

**Bio Field**:
- [ ] Type more than 160 characters
- [ ] Character counter shows red
- [ ] Error: "Bio must be less than 160 characters"
- [ ] Delete some characters
- [ ] Error disappears

#### 2.3 Form Submission
- [ ] Fill form with valid data
- [ ] Click "Save Changes" button
- [ ] Button shows "Saving..." with disabled state
- [ ] After response:
  - [ ] Success toast appears: "Profile updated successfully!"
  - [ ] Redirects to profile page
  - [ ] User info on profile reflects changes

#### 2.4 Error Handling
- [ ] Simulate network error (dev tools)
- [ ] Click "Save Changes"
- [ ] Error toast appears: "Failed to update profile"
- [ ] Stay on edit page
- [ ] Form data preserved

#### 2.5 Cancel Button
- [ ] Click "Cancel" button
- [ ] Navigate back to previous page
- [ ] Changes not saved

---

## Test 3: Followers Page

### Location
- URL: `http://localhost:3000/profile/[userId]/followers`
- Navigation: Profile page → Click followers count

### Test Steps

#### 3.1 Page Load
- [ ] Page loads with back button and "Followers" header
- [ ] Followers list displays with UserCard for each follower
- [ ] Empty state displays if no followers:
  - [ ] Icon visible
  - [ ] Title: "No followers yet"
  - [ ] Message: "This user has no followers yet"

#### 3.2 Follow/Unfollow
- [ ] If followers list is not empty:
  - [ ] Each user has a follow/unfollow button
  - [ ] Follow button works (changes to "Following")
  - [ ] Unfollow button works (changes to "Follow")

#### 3.3 Navigation
- [ ] Click back button
- [ ] Return to profile page
- [ ] Click on a user card
- [ ] Navigate to that user's profile

#### 3.4 Error Handling
- [ ] Simulate network error
- [ ] Error state displays with retry button
- [ ] Click retry
- [ ] List reloads

---

## Test 4: Following Page

### Location
- URL: `http://localhost:3000/profile/[userId]/following`
- Navigation: Profile page → Click following count

### Test Steps

#### 4.1 Page Load
- [ ] Page loads with back button and "Following" header
- [ ] Following list displays with UserCard for each user
- [ ] Empty state displays if not following anyone:
  - [ ] Icon visible
  - [ ] Title: "Not following anyone yet"
  - [ ] Message: "This user is not following anyone yet"

#### 4.2 Follow/Unfollow
- [ ] If following list is not empty:
  - [ ] Each user has a follow/unfollow button
  - [ ] Works correctly

#### 4.3 Navigation & Errors
- [ ] Same as Followers page tests

---

## Test 5: Toast Notifications

### Throughout the app:

#### 5.1 Success Toasts
- [ ] Follow a user
- [ ] Success toast: "User followed" (if implemented) or immediate button change
- [ ] Edit profile successfully
- [ ] Success toast: "Profile updated successfully!"
- [ ] Toast auto-dismisses after 3 seconds

#### 5.2 Error Toasts
- [ ] Cause an error (network error, invalid submission)
- [ ] Error toast appears: "Failed to [action]"
- [ ] Toast shows for 4 seconds
- [ ] Can close manually by clicking X
- [ ] Can close all toasts

#### 5.3 Toast Position
- [ ] Toasts appear in top-right corner
- [ ] Multiple toasts stack vertically
- [ ] Rich colors: green for success, red for error

---

## Test 6: Profile Page Enhancements

### Location
- URL: `http://localhost:3000/profile/[userId]`

### Test Steps

#### 6.1 Own Profile
- [ ] Navigate to own profile
- [ ] "Edit" button visible (with settings icon)
- [ ] Click "Edit" button
- [ ] Navigate to edit page

#### 6.2 Other User Profile
- [ ] Navigate to another user's profile
- [ ] "Edit" button NOT visible
- [ ] "Follow" or "Following" button visible
- [ ] Works correctly

#### 6.3 Clickable Stats
- [ ] Click on "X Following" stat
- [ ] Navigate to following list page
- [ ] Click on "X Followers" stat
- [ ] Navigate to followers list page
- [ ] Back button works correctly

---

## Test 7: Sidebar Navigation

### Test Steps

#### 7.1 Navigation Links
- [ ] Sidebar visible on desktop
- [ ] New "Discover" link visible
- [ ] "Discover" link has Users icon (not Explore)
- [ ] Click "Discover"
- [ ] Navigate to `/users` page
- [ ] Other navigation links still work:
  - [ ] Home → /feed
  - [ ] Notifications → /notifications
  - [ ] Messages → /messages
  - [ ] Bookmarks → /bookmarks

---

## Test 8: Search Input Component

### Test Steps

#### 8.1 Search Behavior
- [ ] Type in search input slowly
- [ ] No API calls should happen until 300ms after last keystroke
- [ ] Verify in network tab: debouncing works
- [ ] Type very fast
- [ ] Only one API call should be made

#### 8.2 Search Icon & Clear Button
- [ ] Search icon visible when input is empty
- [ ] As you type, clear button (X) appears
- [ ] Click clear button
- [ ] Input clears
- [ ] Clear button disappears

---

## Test 9: Error States

### Test Steps

#### 9.1 Error State Component
- [ ] Navigate to error scenario (e.g., profile of non-existent user)
- [ ] Error state displays with:
  - [ ] Error icon (AlertCircle)
  - [ ] Title: "User not found" or similar
  - [ ] Message explaining the error
  - [ ] "Try Again" button (if applicable)

#### 9.2 Empty State Component
- [ ] View followers/following of user with no followers/following
- [ ] Empty state displays with:
  - [ ] Empty icon (Inbox)
  - [ ] Title: "No followers yet"
  - [ ] Message: "This user has no followers yet"
  - [ ] Optional action button (if applicable)

---

## Test 10: Responsive Design

### Test Steps

#### 10.1 Mobile (iPhone SE / 375px width)
- [ ] All pages load and display correctly
- [ ] Sidebar hidden (shown as drawer or hamburger)
- [ ] Touch targets large enough (min 44px)
- [ ] Text readable without zooming
- [ ] Forms easy to fill on mobile

#### 10.2 Tablet (iPad / 768px width)
- [ ] Layout adjusts correctly
- [ ] Sidebar visible or collapsible
- [ ] Content centered with max-width

#### 10.3 Desktop (1024px+)
- [ ] Full layout with sidebar
- [ ] Max-width container for content
- [ ] All features visible

---

## Test 11: Dark Mode

### Test Steps
- [ ] Toggle dark mode (if available or use browser setting)
- [ ] All new pages display correctly in dark mode:
  - [ ] Text visible (white text on dark background)
  - [ ] Borders visible (dark mode borders)
  - [ ] Buttons visible and clickable
  - [ ] Form inputs visible
- [ ] Toggle back to light mode
- [ ] Everything still works

---

## Test 12: Accessibility

### Test Steps

#### 12.1 Keyboard Navigation
- [ ] Use Tab key to navigate
- [ ] All interactive elements reachable:
  - [ ] Search input
  - [ ] Follow buttons
  - [ ] Form fields
  - [ ] Submit buttons
- [ ] Visual focus indicator visible (blue ring)
- [ ] Enter/Space activates buttons

#### 12.2 Screen Reader
- [ ] Use screen reader (VoiceOver on macOS)
- [ ] Page title announced
- [ ] Form labels announced
- [ ] Button labels announced
- [ ] Error messages announced

---

## Test 13: Performance

### Test Steps

#### 13.1 Load Times
- [ ] Dev tools network tab
- [ ] First contentful paint: < 2s
- [ ] Time to interactive: < 3s

#### 13.2 Large Lists
- [ ] Load users discovery with many users
- [ ] Smooth scrolling
- [ ] No lag or jank
- [ ] Images/content loads progressively

#### 13.3 Memory
- [ ] Open Chrome DevTools
- [ ] Memory tab
- [ ] No memory leaks (memory stable after navigation)

---

## 🐛 Bug Report Template

If you find an issue, report it with:

```
**Title**: [Feature] Brief description

**Steps to Reproduce**:
1. Navigate to ...
2. Click ...
3. Expected: ...
4. Actual: ...

**Screenshots**: (if applicable)

**Error Log**: (console errors)

**Browser**: Chrome/Safari/Firefox
**OS**: macOS/Windows/iOS/Android
```

---

## ✅ Sign-Off Checklist

All features are ready for production when:

- [ ] All 13 test suites pass
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Responsive on all devices
- [ ] Dark mode works
- [ ] Toast notifications work
- [ ] Error handling works
- [ ] Optimistic updates feel smooth
- [ ] Performance is acceptable
- [ ] Accessibility keyboard nav works

---

## 🎯 Quick Test (5 mins)

If you have limited time, run this quick test:

1. Navigate to `/users`
2. Search for a user
3. Follow a user
4. Navigate to `/profile/edit`
5. Update bio
6. Save and verify success toast
7. Navigate to followers
8. Verify page loads

If all steps work → **Features are working!** ✅
