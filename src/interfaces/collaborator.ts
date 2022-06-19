enum CollaboratorRole {
  Viewer = 'viewer',
  Editor = 'editor',
  Commentor = 'commentor',
  Suggestor = 'suggestor',
  Owner = 'owner'
}

export default interface Collaborator {
  user: string
  role: CollaboratorRole
}
