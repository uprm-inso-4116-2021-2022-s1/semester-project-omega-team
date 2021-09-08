#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:5.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
WORKDIR /src
COPY ["Spot.Backend/Spot.Backend.csproj", "Spot.Backend/"]
RUN dotnet restore "Spot.Backend/Spot.Backend.csproj"
COPY . .
WORKDIR "/src/Spot.Backend"
RUN dotnet build "Spot.Backend.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Spot.Backend.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Spot.Backend.dll"]