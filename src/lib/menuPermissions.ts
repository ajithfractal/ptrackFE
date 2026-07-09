function permissionMatches(userPermission: string, required: string): boolean {
  if (required.endsWith(':*')) {
    const prefix = required.slice(0, -1)
    return userPermission.startsWith(prefix)
  }

  return userPermission === required
}

export function userHasAnyPermission(
  userPermissions: string[] | undefined,
  required: readonly string[]
): boolean {
  if (!userPermissions?.length || !required.length) {
    return false
  }

  return required.some((req) =>
    userPermissions.some((userPerm) => permissionMatches(userPerm, req))
  )
}
