export type Profile = {
  username: string;
  bio: string;
  image: string;
  following: boolean;
};

export interface ProfileResponseObject {
  profile: Profile;
}
