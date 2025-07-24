// Affiliation and Badge Management System (Twitter-like)

// Initialize global affiliation data if not exists
if (!global.affiliationManager) {
  global.affiliationManager = {
    organizations: {},
    affiliations: {},
    users: {}
  };
}

// Organization types and their badge colors
export const BADGE_TYPES = {
  ORGANIZATION: {
    type: 'organization',
    color: '#FFD700', // Gold
    icon: '🏢',
    label: 'Verified Organization'
  },
  AFFILIATED: {
    type: 'affiliated',
    color: '#1DA1F2', // Twitter Blue
    icon: '✓',
    label: 'Verified'
  }
};

// Register an organization and grant golden badge
export const registerOrganization = (orgData) => {
  // Generate a more unique ID using timestamp + random number
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  const orgId = `org_${timestamp}_${random}`;
  
  const organization = {
    id: orgId,
    name: orgData.name,
    email: orgData.email,
    phone: orgData.phone,
    address: orgData.address,
    website: orgData.website,
    description: orgData.description,
    badge: BADGE_TYPES.ORGANIZATION,
    verifiedAt: new Date().toISOString(),
    status: 'verified',
    ...orgData
  };
  
  global.affiliationManager.organizations[orgId] = organization;
  return organization;
};

// Get organization by ID
export const getOrganization = (orgId) => {
  return global.affiliationManager.organizations[orgId] || null;
};

// Get all organizations
export const getAllOrganizations = () => {
  return Object.values(global.affiliationManager.organizations);
};

// Create affiliation between user and organization
export const createAffiliation = (userId, orgId, userData) => {
  // Generate a more unique ID using timestamp + random number
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  const affiliationId = `aff_${timestamp}_${random}`;
  const organization = getOrganization(orgId);
  
  if (!organization) {
    throw new Error('Organization not found');
  }
  
  const affiliation = {
    id: affiliationId,
    userId,
    orgId,
    organizationName: organization.name,
    userData: {
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      position: userData.position,
      department: userData.department
    },
    badge: BADGE_TYPES.AFFILIATED,
    verifiedAt: new Date().toISOString(),
    status: 'verified'
  };
  
  global.affiliationManager.affiliations[affiliationId] = affiliation;
  
  // Update user with affiliation info
  global.affiliationManager.users[userId] = {
    ...global.affiliationManager.users[userId],
    affiliationId,
    badge: BADGE_TYPES.AFFILIATED,
    organizationName: organization.name
  };
  
  return affiliation;
};

// Get user's affiliation
export const getUserAffiliation = (userId) => {
  return global.affiliationManager.users[userId] || null;
};

// Get all affiliations for an organization
export const getOrganizationAffiliations = (orgId) => {
  return Object.values(global.affiliationManager.affiliations)
    .filter(aff => aff.orgId === orgId);
};

// Check if user has any badge
export const getUserBadge = (userId) => {
  const user = global.affiliationManager.users[userId];
  return user ? user.badge : null;
};

// Get affiliation statistics
export const getAffiliationStats = () => {
  const organizations = Object.keys(global.affiliationManager.organizations).length;
  const affiliations = Object.keys(global.affiliationManager.affiliations).length;
  const users = Object.keys(global.affiliationManager.users).length;
  
  return {
    totalOrganizations: organizations,
    totalAffiliations: affiliations,
    totalAffiliatedUsers: users
  };
};

// Remove affiliation
export const removeAffiliation = (affiliationId) => {
  const affiliation = global.affiliationManager.affiliations[affiliationId];
  if (affiliation) {
    const userId = affiliation.userId;
    
    // Remove from affiliations
    delete global.affiliationManager.affiliations[affiliationId];
    
    // Remove badge from user
    if (global.affiliationManager.users[userId]) {
      delete global.affiliationManager.users[userId].affiliationId;
      delete global.affiliationManager.users[userId].badge;
      delete global.affiliationManager.users[userId].organizationName;
    }
    
    return true;
  }
  return false;
};

// Search organizations by name
export const searchOrganizations = (query) => {
  const organizations = getAllOrganizations();
  return organizations.filter(org => 
    org.name.toLowerCase().includes(query.toLowerCase()) ||
    org.description?.toLowerCase().includes(query.toLowerCase())
  );
};

// Clean up duplicate organizations (keep the first occurrence by name)
export const cleanupDuplicateOrganizations = () => {
  const organizations = Object.values(global.affiliationManager.organizations);
  const uniqueOrgs = {};
  const seenNames = new Set();
  
  organizations.forEach(org => {
    if (!seenNames.has(org.name)) {
      seenNames.add(org.name);
      uniqueOrgs[org.id] = org;
    }
  });
  
  global.affiliationManager.organizations = uniqueOrgs;
  return Object.keys(uniqueOrgs).length;
};

// Clear all affiliations and reset to clean state
export const clearAllAffiliations = () => {
  global.affiliationManager.affiliations = {};
  global.affiliationManager.users = {};
  console.log('All affiliations cleared - users start with no badges');
};

// Clear affiliations for a specific user
export const clearUserAffiliation = (userId) => {
  // Remove from users
  delete global.affiliationManager.users[userId];
  
  // Remove from affiliations
  Object.keys(global.affiliationManager.affiliations).forEach(affId => {
    const affiliation = global.affiliationManager.affiliations[affId];
    if (affiliation.userId === userId) {
      delete global.affiliationManager.affiliations[affId];
    }
  });
  
  console.log(`Cleared affiliation for user: ${userId}`);
}; 