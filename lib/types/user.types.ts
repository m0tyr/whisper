export interface UserDefinition {
    user: UserObject;
    isFollowing: boolean;
}

export interface UserObject {
    username: string;
    name: string;
    id: string;
    image: string;
}