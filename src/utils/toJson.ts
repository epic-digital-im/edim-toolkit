const toJson = (obj: any) => {
  return obj && obj.toJSON ? obj.toJSON() : {};
}

export default toJson;