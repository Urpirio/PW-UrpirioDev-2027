interface tp_Fetch {
  pathname: string;
}

export const Fetch = async ({ pathname }: tp_Fetch) => {
  const respuesta = await fetch(
    `https://pw-urpiriodev-cms-2027-production.up.railway.app${pathname}`,
    {
      method: "GET",
      headers: {
        Authorization:
          "bearer 1597b15f2b729109e701a14127532e4211b59b83ad611bfe8e5dd616d7f12e07962f5df76bb3cc0f036f8c4ecee266c60af589cdbdb0f18dcc013b27ba3919e539b69be5df115872dfcf65fb1ef0aa3d24b104cd2309d521933174d95bebffd5e759c1484da517913a95396021cc81c1423ae7339e224251a33fd324bfe58a4d",
      },
    },
  );

  return await respuesta.json();
};
