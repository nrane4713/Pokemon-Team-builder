-- CreateTable
CREATE TABLE "Preset" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PresetTeam" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "presetId" TEXT NOT NULL,
    "gameKey" TEXT NOT NULL,
    "label" TEXT,
    "orderIndex" INTEGER NOT NULL,
    CONSTRAINT "PresetTeam_presetId_fkey" FOREIGN KEY ("presetId") REFERENCES "Preset" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PresetSlot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "presetTeamId" TEXT NOT NULL,
    "slotIndex" INTEGER NOT NULL,
    "pokemonFormId" TEXT NOT NULL,
    CONSTRAINT "PresetSlot_presetTeamId_fkey" FOREIGN KEY ("presetTeamId") REFERENCES "PresetTeam" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "PresetTeam_presetId_idx" ON "PresetTeam"("presetId");

-- CreateIndex
CREATE UNIQUE INDEX "PresetSlot_presetTeamId_slotIndex_key" ON "PresetSlot"("presetTeamId", "slotIndex");
