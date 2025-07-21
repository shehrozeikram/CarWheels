# Reusable Components

This directory contains reusable components that can be used across the CarWheels app to reduce code duplication and maintain consistency.

## Components Overview

### 1. Header
A reusable header component with customizable title, back button, and right actions.

**Usage:**
```jsx
import { Header } from '../components';

<Header
  title="Screen Title"
  onBackPress={() => navigation.goBack()}
  rightComponent={<CustomRightComponent />}
  showBackButton={true}
  backgroundColor="#900C3F"
  titleColor="#fff"
/>
```

**Props:**
- `title` (string): Header title
- `onBackPress` (function): Back button press handler
- `rightComponent` (ReactNode): Optional right side component
- `showBackButton` (boolean): Show/hide back button (default: true)
- `backgroundColor` (string): Header background color (default: '#900C3F')
- `titleColor` (string): Title text color (default: '#fff')
- `style` (object): Additional styles

### 2. BottomNavigation
A reusable bottom navigation component that matches the original design exactly.

**Usage:**
```jsx
import { BottomNavigation } from '../components';

<BottomNavigation
  activeTab="Home"
  onHomePress={() => {}}
  onAdsPress={() => navigation.navigate('AdsScreen')}
  onChatPress={() => navigation.navigate('ChatScreen')}
  onMorePress={() => navigation.navigate('ProfileScreen')}
  onSellPress={() => handleSellPress()}
/>
```

**Props:**
- `activeTab` (string): Currently active tab ('Home', 'Ads', 'Chat', 'More')
- `onHomePress` (function): Home tab press handler
- `onAdsPress` (function): Ads tab press handler
- `onChatPress` (function): Chat tab press handler
- `onMorePress` (function): More tab press handler
- `onSellPress` (function): Sell button press handler
- `style` (object): Additional styles

### 3. SearchBar
A reusable search bar component that matches the original design exactly.

**Usage:**
```jsx
import { SearchBar } from '../components';

<SearchBar
  placeholder="Search cars..."
  editable={false}
  locationText="All Cities"
  onPress={() => navigation.navigate('SearchUsedCars')}
/>
```

**Props:**
- `placeholder` (string): Input placeholder text
- `value` (string): Input value (optional)
- `onChangeText` (function): Text change handler (optional)
- `onPress` (function): Press handler for the entire search bar
- `locationText` (string): Location display text (default: "All Cities")
- `editable` (boolean): Input editable state (default: true)
- `style` (object): Input styles
- `containerStyle` (object): Container styles

### 4. CarCard
A reusable car card component for displaying car information consistently.

**Usage:**
```jsx
import { CarCard } from '../components';

<CarCard
  car={carData}
  onPress={() => navigation.navigate('CarDetailScreen', { car: carData })}
  onHeartPress={() => handleHeartPress()}
  showBadges={true}
  showHeart={true}
/>
```

**Props:**
- `car` (object): Car data object with properties like title, price, city, year, km, fuel, image, etc.
- `onPress` (function): Card press handler
- `onHeartPress` (function): Heart button press handler
- `showBadges` (boolean): Show/hide badges (default: true)
- `showHeart` (boolean): Show/hide heart button (default: true)
- `style` (object): Additional styles

### 5. SectionHeader
A reusable section header component with optional "View All" button.

**Usage:**
```jsx
import { SectionHeader } from '../components';

<SectionHeader
  title="Featured Cars"
  onViewAllPress={() => navigation.navigate('CarListScreen')}
  viewAllText="View All"
/>
```

**Props:**
- `title` (string): Section title
- `onViewAllPress` (function): View all button press handler
- `viewAllText` (string): View all button text (default: "View All")
- `style` (object): Container styles
- `titleStyle` (object): Title text styles
- `viewAllStyle` (object): View all button styles

### 6. HorizontalScrollSection
A reusable horizontal scroll section component for consistent card rows.

**Usage:**
```jsx
import { HorizontalScrollSection } from '../components';

<HorizontalScrollSection>
  <CarCard car={car1} onPress={() => {}} />
  <CarCard car={car2} onPress={() => {}} />
  <CarCard car={car3} onPress={() => {}} />
</HorizontalScrollSection>
```

**Props:**
- `children` (ReactNode): Child components to render
- `style` (object): ScrollView styles
- `contentContainerStyle` (object): Content container styles
- `showsHorizontalScrollIndicator` (boolean): Show scroll indicator (default: false)

### 7. LoadingSpinner
A reusable loading spinner component for consistent loading states.

**Usage:**
```jsx
import { LoadingSpinner } from '../components';

<LoadingSpinner
  text="Loading cars..."
  size="large"
  color="#900C3F"
/>
```

**Props:**
- `text` (string): Loading text (default: "Loading...")
- `size` (string): Spinner size ('small', 'large') (default: "large")
- `color` (string): Spinner color (default: "#900C3F")
- `style` (object): Container styles
- `textStyle` (object): Text styles

### 8. EmptyState
A reusable empty state component for consistent empty state displays.

**Usage:**
```jsx
import { EmptyState } from '../components';

<EmptyState
  icon="🚗"
  title="No cars found"
  subtitle="Try adjusting your search criteria"
  actionText="Browse All Cars"
  onActionPress={() => navigation.navigate('CarListScreen')}
/>
```

**Props:**
- `icon` (string): Emoji icon (default: "📭")
- `title` (string): Empty state title (default: "No items found")
- `subtitle` (string): Empty state subtitle
- `actionText` (string): Action button text
- `onActionPress` (function): Action button press handler
- `style` (object): Container styles
- `iconStyle` (object): Icon styles
- `titleStyle` (object): Title styles
- `subtitleStyle` (object): Subtitle styles
- `actionStyle` (object): Action button styles

### 9. InlineError
A reusable inline error component for form validation.

**Usage:**
```jsx
import { InlineError } from '../components';

<InlineError
  visible={!!emailError}
  message={emailError}
/>
```

**Props:**
- `visible` (boolean): Show/hide error
- `message` (string): Error message text

## Importing Components

You can import individual components:
```jsx
import { Header } from '../components/Header';
import { BottomNavigation } from '../components/BottomNavigation';
```

Or import multiple components from the index:
```jsx
import { 
  Header, 
  BottomNavigation, 
  SearchBar, 
  CarCard,
  SectionHeader,
  HorizontalScrollSection,
  LoadingSpinner,
  EmptyState,
  InlineError 
} from '../components';
```

## Benefits

1. **Code Reusability**: Reduce code duplication across screens
2. **Consistency**: Maintain consistent UI/UX across the app
3. **Maintainability**: Update components in one place
4. **iOS RTL Fixes**: All components include proper LTR layout fixes for iOS
5. **Type Safety**: Consistent prop interfaces
6. **Performance**: Optimized components with proper memoization

## Migration Guide

To migrate existing screens to use these components:

1. Replace custom headers with `<Header>` component
2. Replace bottom navigation with `<BottomNavigation>` component
3. Replace search bars with `<SearchBar>` component
4. Replace car cards with `<CarCard>` component
5. Replace section headers with `<SectionHeader>` component
6. Replace horizontal scroll sections with `<HorizontalScrollSection>` component
7. Replace loading states with `<LoadingSpinner>` component
8. Replace empty states with `<EmptyState>` component
9. Replace inline errors with `<InlineError>` component

## Example Migration

**Before:**
```jsx
<View style={styles.header}>
  <TouchableOpacity onPress={() => navigation.goBack()}>
    <Image source={require('../assets/images/back_arrow.png')} />
  </TouchableOpacity>
  <Text style={styles.headerTitle}>Screen Title</Text>
</View>
```

**After:**
```jsx
<Header
  title="Screen Title"
  onBackPress={() => navigation.goBack()}
/>
``` 