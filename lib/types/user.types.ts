export interface UserDefinition {
    user: User;
    isFollowing: boolean;
}

interface User {
    username: string;
    name: string;
    id: string;
    image: string;
}